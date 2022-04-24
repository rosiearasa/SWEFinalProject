package edu.brynmawr.cs353.thefridge;

/*
    Date: 4/23/22
    Home page to redirect to options once user is signed in
    Other pages redirect back here
 */

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

public class HomePageActivity extends AppCompatActivity {

    //current user
    String user = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        user = getIntent().getStringExtra("user");

        setContentView(R.layout.activity_homepage);

        //displays welcome message
        TextView welcomeView = (TextView) findViewById(R.id.welcome);
        welcomeView.setText("Welcome " + user + "!");
    }

    //go to delete item activity
    public void deleteItemButtonClick(View v) {
        Intent intent = new Intent(this, DeleteItemActivity.class);
        intent.putExtra("user", user);
        startActivity(intent);
    }

    //go to page to see items in the fridge
    public void seeItemsButtonClick(View v) {
        Log.v("checkin", "see items button clicked");
        Intent intent = new Intent(this, SeeItemsActivity.class);
        intent.putExtra("user", user);
        startActivity(intent);
    }

    //go to add item activity
    public void addItemButtonClick(View v) {
        Intent intent = new Intent(this, AddItemActivity.class);
        intent.putExtra("user", user);
        startActivity(intent);
    }

}
