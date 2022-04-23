package edu.brynmawr.cs353.thefridge;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

public class HomePageActivity extends AppCompatActivity {

    String user = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        user = getIntent().getStringExtra("user");

        setContentView(R.layout.activity_homepage);

        TextView welcomeView = (TextView) findViewById(R.id.welcome);
        welcomeView.setText("Welcome " + user + "!");
    }

    public void deleteItemButtonClick(View v) {
        Intent intent = new Intent(this, AddItemActivity.class);
        intent.putExtra("user", user);
        startActivity(intent);
    }

    public void seeItemsButtonClick(View v) {
        Log.v("checkin", "see items button clicked");
        Intent intent = new Intent(this, SeeItemsActivity.class);
        intent.putExtra("user", user);
        startActivity(intent);
    }

    public void addItemButtonClick(View v) {
        Intent intent = new Intent(this, AddItemActivity.class);
        intent.putExtra("user", user);
        startActivity(intent);
    }

}
