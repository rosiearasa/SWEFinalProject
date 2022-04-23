package edu.brynmawr.cs353.thefridge;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;

import androidx.appcompat.app.AppCompatActivity;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Date;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class AddItemActivity extends AppCompatActivity {

    boolean today = false;
    boolean publicNote = false;
    boolean anonymous = false;

    String user = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        user = getIntent().getStringExtra("user");
        setContentView(R.layout.activity_add_item);
    }

    public void onAddItem(View v) {
        EditText typeView = (EditText) findViewById(R.id.type);
        String type = typeView.getText().toString();
        Log.v("type",type);

        EditText expDateView = (EditText) findViewById(R.id.expDate);
        String expDate = expDateView.getText().toString();
        Log.v("expDate",expDate);

        String dateAdded = null;
        if(today) {
            dateAdded = (new Date()).toString();
        } else {
            EditText dateAddedView = (EditText) findViewById(R.id.dateAdded);
            dateAdded = dateAddedView.getText().toString();
        }
        Log.v("dateAdded", dateAdded);

        EditText noteView = (EditText) findViewById(R.id.note);
        String note = noteView.getText().toString();
        Log.v("note",note);
        Log.v("public", publicNote ? "true" : "false");

        addItemToDataBase(type, expDate, dateAdded, note, null);

        goToSubmissionPage();
    }

    public void addItemToDataBase(String type, String expDate, String dateAdded, String note, String userName) {

        try {
            ExecutorService executor = Executors.newSingleThreadExecutor();
            executor.execute( () -> {
                    try {
                        //create the url for /add_item
                        String end = "?type="+type+"&expDate="+expDate+"&dateAdded="+dateAdded;
                        end += String.format("&userName=%s&user=%s&inFridge=%d&anonymous=%b&note=%s&public=%s", user, null, 0, anonymous, note, publicNote);
                        //Log.v("url", end);
                        Log.v("anonymous", anonymous==false ? "false" : "true");

                        URL url = new URL("http://10.0.2.2:3000/add_item"+end);

                        //open the connection and send the url through
                        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                        conn.setRequestMethod("GET");
                        conn.connect();
                        url.openStream();


                        Log.v("message", "successfully added");

                    }
                    catch (Exception e) {
                        Log.v("error", e.toString());
                    }
                }
            );

            // this waits for up to 2 seconds
            // it's a bit of a hack because it's not truly asynchronous
            // but it should be okay for our purposes (and is a lot easier)
            executor.awaitTermination(2, TimeUnit.SECONDS);

            // now we can set the status in the TextView
            Log.v("message", "finished everything");
        }
        catch (Exception e) {
            // uh oh
            e.printStackTrace();
            //tv.setText(e.toString());
        }
    }

    public void goToSubmissionPage() {
        Intent intent = new Intent(this, AddItemSubmission.class);
        intent.putExtra("user", user);
        startActivity(intent);
    }

    public void onTodayCheckboxClicked(View v) {
        today = true;
    }

    public void onPublicCheckboxClicked(View v) {
        Log.v("checked", "public checkmark clicked");
        publicNote = true;
    }

    public void onAnonymousCheckboxClicked(View v) {
        Log.v("checked", "anonymous checkmark clicked");
        anonymous = true;
    }
}
